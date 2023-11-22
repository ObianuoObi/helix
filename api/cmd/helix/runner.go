package helix

import (
	"fmt"
	"os"
	"os/signal"

	"github.com/lukemarsden/helix/api/pkg/runner"
	"github.com/lukemarsden/helix/api/pkg/system"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"
)

type RunnerOptions struct {
	Runner runner.RunnerOptions
	Server runner.RunnerServerOptions
}

func NewRunnerOptions() *RunnerOptions {
	return &RunnerOptions{
		Runner: runner.RunnerOptions{
			ID:                          getDefaultServeOptionString("RUNNER_ID", ""),
			ApiHost:                     getDefaultServeOptionString("API_HOST", ""),
			ApiToken:                    getDefaultServeOptionString("API_TOKEN", ""),
			MemoryBytes:                 uint64(getDefaultServeOptionInt("MEMORY_BYTES", 0)),
			MemoryString:                getDefaultServeOptionString("MEMORY_STRING_", ""),
			ModelInstanceTimeoutSeconds: getDefaultServeOptionInt("TIMEOUT_SECONDS", 10),
			GetTaskDelayMilliseconds:    getDefaultServeOptionInt("GET_TASK_DELAY_MILLISECONDS", 100),
			ReporStateDelaySeconds:      getDefaultServeOptionInt("REPORT_STATE_DELAY_SECONDS", 1),
			LocalMode:                   getDefaultServeOptionBool("LOCAL_MODE", false),
			Labels:                      getDefaultServeOptionMap("LABELS", map[string]string{}),
		},
		Server: runner.RunnerServerOptions{
			Host: getDefaultServeOptionString("SERVER_HOST", "0.0.0.0"),
			Port: getDefaultServeOptionInt("SERVER_PORT", 8080),
		},
	}
}

func newRunnerCmd() *cobra.Command {
	allOptions := NewRunnerOptions()

	runnerCmd := &cobra.Command{
		Use:     "runner",
		Short:   "Start a helix runner.",
		Long:    "Start a helix runner.",
		Example: "TBD",
		RunE: func(cmd *cobra.Command, _ []string) error {
			return runnerCLI(cmd, allOptions)
		},
	}

	runnerCmd.PersistentFlags().StringVar(
		&allOptions.Runner.ID, "runner-id", allOptions.Runner.ID,
		`The ID of this runner to report to the api server when asking for jobs`,
	)

	runnerCmd.PersistentFlags().StringVar(
		&allOptions.Runner.ApiHost, "api-host", allOptions.Runner.ApiHost,
		`The base URL of the api - e.g. http://1.2.3.4:8080`,
	)

	runnerCmd.PersistentFlags().StringVar(
		&allOptions.Runner.ApiToken, "api-token", allOptions.Runner.ApiToken,
		`The auth token for this runner`,
	)

	runnerCmd.PersistentFlags().Uint64Var(
		&allOptions.Runner.MemoryBytes, "memory-bytes", allOptions.Runner.MemoryBytes,
		`The number of bytes of GPU memory available - e.g. 1073741824`,
	)

	runnerCmd.PersistentFlags().StringVar(
		&allOptions.Runner.MemoryString, "memory", allOptions.Runner.MemoryString,
		`Short notation for the amount of GPU memory available - e.g. 1GB`,
	)

	runnerCmd.PersistentFlags().StringToStringVar(
		&allOptions.Runner.Labels, "label", allOptions.Runner.Labels,
		`Labels to attach to this runner`,
	)

	runnerCmd.PersistentFlags().IntVar(
		&allOptions.Runner.ModelInstanceTimeoutSeconds, "timeout-seconds", allOptions.Runner.ModelInstanceTimeoutSeconds,
		`How many seconds without a task before we shutdown a running model instance`,
	)

	runnerCmd.PersistentFlags().IntVar(
		&allOptions.Runner.GetTaskDelayMilliseconds, "get-task-delay-milliseconds", allOptions.Runner.GetTaskDelayMilliseconds,
		`How many milliseconds do we wait between running the control loop (which asks for the next global session)`,
	)

	runnerCmd.PersistentFlags().IntVar(
		&allOptions.Runner.ReporStateDelaySeconds, "report-state-delay-seconds", allOptions.Runner.ReporStateDelaySeconds,
		`How many seconds do we wait between reporting our state to the api`,
	)

	runnerCmd.PersistentFlags().BoolVar(
		&allOptions.Runner.LocalMode, "local-mode", allOptions.Runner.LocalMode,
		`Are we running in local mode?`,
	)

	runnerCmd.PersistentFlags().StringVar(
		&allOptions.Server.Host, "server-host", allOptions.Server.Host,
		`The host to bind the runner server to.`,
	)
	runnerCmd.PersistentFlags().IntVar(
		&allOptions.Server.Port, "server-port", allOptions.Server.Port,
		`The port to bind the runner server to.`,
	)

	return runnerCmd
}

func runnerCLI(cmd *cobra.Command, options *RunnerOptions) error {
	system.SetupLogging()

	// Cleanup manager ensures that resources are freed before exiting:
	cm := system.NewCleanupManager()
	defer cm.Cleanup(cmd.Context())
	ctx := cmd.Context()

	// Context ensures main goroutine waits until killed with ctrl+c:
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	// we will append the instance ID onto these paths
	// because it's a model_instance that will spawn Python
	// processes that will then speak back to these routes
	options.Runner.TaskURL = fmt.Sprintf("http://localhost:%d/api/v1/worker/task", options.Server.Port)
	options.Runner.InitialSessionURL = fmt.Sprintf("http://localhost:%d/api/v1/worker/initial_session", options.Server.Port)

	runnerController, err := runner.NewRunner(ctx, options.Runner)
	if err != nil {
		return err
	}

	err = runnerController.Initialize(ctx)
	if err != nil {
		return err
	}

	go runnerController.StartLooping()

	server, err := runner.NewRunnerServer(options.Server, runnerController)
	if err != nil {
		return err
	}

	log.Info().Msgf("Helix runner listening on %s:%d", options.Server.Host, options.Server.Port)

	go func() {
		err := server.ListenAndServe(ctx, cm)
		if err != nil {
			panic(err)
		}
	}()

	<-ctx.Done()
	return nil
}