import React from 'react'
import { Timeline, Stack } from '@primer/react-brand'

export type ListMessageProps = {
  message: string
  fullWidth?: boolean
}

/**
 * Generic message renderer for list-like sections.
 * Internally uses the Timeline subcomponent for consistent styling.
 */
const ListMessage: React.FC<ListMessageProps> = ({ message, fullWidth = true }) => {
  return (
    <Stack padding="spacious" alignItems="center" gap="spacious">
      <Timeline fullWidth={fullWidth}>
        <Timeline.Item>{message}</Timeline.Item>
      </Timeline>
    </Stack>
  )
}

export default ListMessage
