import React, { FC, useCallback, MouseEvent } from 'react'
import { SxProps } from '@mui/system'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'

import Row from '../widgets/Row'
import Cell from '../widgets/Cell'

import useAccount from '../../hooks/useAccount'
import useRouter from '../../hooks/useRouter'

import {
  IFeature,
} from '../../types'

const CHAT_FEATURE: IFeature = {
  title: 'Chat',
  description: 'Talk to Helix',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const IMAGE_GEN_FEATURE: IFeature = {
  title: 'Image Gen',
  description: 'Generate Images',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const APPS_FEATURE: IFeature = {
  title: 'Apps',
  description: 'View Apps',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const RAG_FEATURE: IFeature = {
  title: 'RAG',
  description: 'Add your own documents',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const FINETUNE_TEXT_FEATURE: IFeature = {
  title: 'Finetune Text',
  description: 'Finetune on text',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const FINETUNE_IMAGES_FEATURE: IFeature = {
  title: 'Finetune Images',
  description: 'Finetune on images',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const JS_APP_FEATURE: IFeature = {
  title: 'JS App',
  description: 'Create a Javascript AI App',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const API_FEATURE: IFeature = {
  title: 'Integrate w/ API',
  description: 'Use the REST API',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const GPTSCRIPT_FEATURE: IFeature = {
  title: 'GPTScript',
  description: 'Run GPTScripts',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const DASHBOARD_FEATURE: IFeature = {
  title: 'Dashboard',
  description: 'Show the platform dashboard',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const USERS_FEATURE: IFeature = {
  title: 'Users',
  description: 'Show Users',
  image: '/img/servers.png',
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const SETTINGS_FEATURE: IFeature = {
  title: 'Settings',
  description: 'Show Settings (coming soon)',
  image: '/img/servers.png',
  disabled: true,
  actions: [{
    title: 'Chat',
    color: 'secondary',
    variant: 'outlined',
    handler: () => {},
  }, {
    title: 'Docs',
    color: 'primary',
    variant: 'text',
    handler: () => {},
  }]
}

const HomeFeatureCard: FC<{
  feature: IFeature,
}> = ({
  feature,
}) => {
  const router = useRouter()
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={ feature.image }
        title={ feature.title }
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { feature.title }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          { feature.description }
        </Typography>
      </CardContent>
      <CardActions>
        <Row>
          {
            feature.actions.map((action, index) => (
              <Cell key={ index }>
                <Button
                  size="small"
                  variant={ action.variant }
                  color={ action.color }
                  onClick={ () => action.handler(router.navigate) }
                >
                  { action.title }
                </Button>
              </Cell>
            ))
          }
        </Row>
      </CardActions>
    </Card>
  )
}

const HomeFeatureSection: FC<{
  title: string,
  features: IFeature[],
  sx?: SxProps,
}> = ({
  title,
  features,
  sx = {},
}) => {
  return (
    <Box sx={sx}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'left',
        }}
      >
        { title }
      </Typography>
      <Divider
        sx={{
          my: 2,
        }}
      />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Grid container spacing={ 0 }>
          { features.map((feature, index) => (
            <Grid item sm={ 12 } md={ 6 } lg={ 4 } key={ index } sx={{ p: 0, m: 0 }}>
              <HomeFeatureCard
                feature={ feature }
              />
            </Grid>
          )) }
        </Grid>
      </Box>
    </Box>
  )
}


const HomeFeatureGrid: FC = ({
  
}) => {

  const account = useAccount()

  return (
    <>
      <HomeFeatureSection
        title="Use"
        features={[
          CHAT_FEATURE,
          IMAGE_GEN_FEATURE,
          APPS_FEATURE,
        ]}
        sx={{
          mb: 4,
        }}
      />

      <HomeFeatureSection
        title="Customize"
        features={[
          RAG_FEATURE,
          FINETUNE_TEXT_FEATURE,
          FINETUNE_IMAGES_FEATURE,
        ]}
        sx={{
          mb: 4,
        }}
      />

      <HomeFeatureSection
        title="Develop"
        features={[
          JS_APP_FEATURE,
          API_FEATURE,
          GPTSCRIPT_FEATURE,
        ]}
        sx={{
          mb: 4,
        }}
      />

      {
        account.admin && (
          <HomeFeatureSection
            title="Admin"
            features={[
              DASHBOARD_FEATURE,
              USERS_FEATURE,
              SETTINGS_FEATURE,
            ]}
          />
        )
      }
    </>
  )
}

export default HomeFeatureGrid