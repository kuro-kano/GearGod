import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  
  // Set each cookie to expire immediately
  allCookies.forEach(cookie => {
    cookies().set({
      name: cookie.name,
      value: '',
      expires: new Date(0),
      path: '/',
    })
  })

  // Also specifically clear cart-related cookies
  cookies().set({
    name: 'cart',
    value: '',
    expires: new Date(0),
    path: '/',
  })

  return NextResponse.json({ 
    success: true,
    message: 'Cookies cleared successfully' 
  })
}