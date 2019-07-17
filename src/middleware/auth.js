import {auth} from '@/plugins/firebase.js'
export default function (context) {
  auth.onAuthStateChanged(function(user) {
    console.log(user);
    if (user) {
      context.store.dispatch('validateUser',{mail:user.email,uid:user.uid})
    } else {
      context.store.dispatch('validateUser',null)
    }
  });
  // context.userAgent = true;
  // console.log(context.userAgent);
}
