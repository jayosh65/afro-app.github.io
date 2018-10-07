import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Join from './views/Join.vue'
import Restaurant from './views/Restaurant.vue'
import Locate from './views/Locate.vue'
import Contact from './views/Contact.vue'
import SignIn from '@/components/SignIn.vue'
import Member from '@/components/member/Index.vue'
import UserRestaurant from '@/components/member/Restaurant.vue'
import UserImage from '@/components/member/Image.vue'
import UserMail from '@/components/member/Mail.vue'
import Changeinfo from '@/components/setting/ChangeUserInfo.vue'
import AuthGuard from '@/auth-guard'
import Adminken from '@/components/admin/AdminSignin.vue'
import AdminComponent from '@/components/admin/Index.vue'
import Register from '@/components/admin/Register.vue'
import Approval from '@/components/admin/Approval.vue'
import Mail from '@/components/admin/Mail.vue'
import Viewmail from '@/components/admin/Viewmail.vue'
import Setting from '@/components/admin/Setting.vue'
import ViewMmail from '@/components/member/Viewmail.vue'
import RequestPassword from '@/components/member/RequestPassword.vue'
import CarouselSetting from '@/components/admin/Image.vue'
import ImageSetting from '@/components/admin/ImageBackground.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      title: 'Home',
      component: Home
    },
    {
      path: '/join',
      name: 'join',
      title: 'Restaurant signup',
      component: Join
    },
    {
      path: '/sign-in',
      name: 'signin',
      title: 'Sign in',
      component: SignIn
    },
    {
      path: '/contact',
      name: 'contact',
      title: 'Contact',
      component: Contact
    }, 
    {
      path: '/locate',
      name: 'locate',
      component: Locate
    },
    {
      path: '/restaurant/:id',
      name: 'Restaurant',
      component: Restaurant,
      props: true
    },               
    {
      path: '/request-password',
      name: 'Request password',
      component: RequestPassword
    },   
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/admin-11-ken-092018',
      name: 'admin signin',
      component: Adminken,
    }, 
    {
      path: '/admin',
      name: 'admin',
      component: AdminComponent,
      beforeEnter: AuthGuard
    },      
    {
      path: '/admin/register',
      name: 'register',
      component: Register,
      beforeEnter: AuthGuard
    }, 
    {
      path: '/admin/approval',
      name: 'approval',
      component: Approval,
      beforeEnter: AuthGuard
    }, 
    {
      path: '/admin/mail',
      name: 'Admin mail',
      component: Mail,
      beforeEnter: AuthGuard
    }, 
    {
      path: '/admin/view-mail/:id',
      name: 'Admin view mail',
      component: Viewmail,
      props: true,
      beforeEnter: AuthGuard
    }, 
    {
      path: '/admin/setting',
      name: 'Admin setting',
      component: Setting,
      props: true,
      beforeEnter: AuthGuard
    },  
    {
      path: '/admin/image-setting',
      name: 'Admin setting image',
      component: CarouselSetting,
      props: true,
      beforeEnter: AuthGuard
    }, 
    {
      path: '/admin/background-setting',
      name: 'Admin background setting',
      component: ImageSetting,
      props: true,
      beforeEnter: AuthGuard
    },               
    {
      path: '/member',
      name: 'member',
      component: Member,
      beforeEnter: AuthGuard
    },
    {
      path: '/member-restaurant/:id',
      name: 'Member Restaurant',
      component: UserRestaurant,
      beforeEnter: AuthGuard,
      props: true
    },
    {
      path: '/member-images',
      name: 'Member Images',
      component: UserImage,
      beforeEnter: AuthGuard,
      props: true
    },
    {
      path: '/member-mail',
      name: 'Member mails',
      component: UserMail,
      beforeEnter: AuthGuard,
      props: true
    },
    {
      path: '/member/view-mail/:id',
      name: 'Member view mail',
      component: ViewMmail,
      props: true,
      beforeEnter: AuthGuard
    },           
    {
      path: '/change-info',
      name: 'changeinfo',
      component: Changeinfo,
      beforeEnter: AuthGuard
    }
  ]
})
