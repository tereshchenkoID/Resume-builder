import {lazy} from 'react'

const Builder = lazy( () => import("../Pages/Builder"));
const Edit = lazy( () => import("../Pages/Edit"));

export const routes = [
  {
    path: '/',
    component: Builder,
    exact: true
  },
  {
    path: '/edit',
    component: Edit,
    exact: false
  }
]
