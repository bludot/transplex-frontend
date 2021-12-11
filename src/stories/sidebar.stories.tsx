import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Sidebar from '../components/Sidebar'

export default {
  title: 'Example/Sidebar',
  component: Sidebar,
  argTypes: {
    color: { control: 'color' },
    size: { control: 'number' },
  },
} as ComponentMeta<typeof Sidebar>

const Template: ComponentStory<typeof Sidebar> = (args) => <Sidebar {...args} />
export const Main = Template.bind({})
Main.args = {}
