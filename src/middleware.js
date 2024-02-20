import { NextResponse } from 'next/server'
import  { NextRequest } from 'next/server'
 

export function middleware( NextRequest) {
   const  request=NextRequest;
  const path = request.nextUrl.pathname

  const isPrivatePath = path === '/Add_Cart'

  const token = request.cookies.get('token')?.value || ''

  if(isPrivatePath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL('/login', request.nextUrl))
  // }
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/Add_Cart',
    // '/profile',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}