import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Image from 'next/image'
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const {isAuthenticated} = getKindeServerSession();
  if (await isAuthenticated()) {
    redirect('/dashboard');
    return 
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-8">
            {/* Replace with your actual logo */}
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Logo"
              width={64}
              height={64}
              className="h-16 w-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Welcome to Our Platform
          </h2>
          <div className="space-y-4">
            <LoginLink 
              postLoginRedirectURL='/dashboard'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex justify-center items-center"
            >
              Log in
            </LoginLink>
            <RegisterLink 
              postLoginRedirectURL='/dashboard'
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex justify-center items-center"
            >
              Register
            </RegisterLink>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600">
            By using our service, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

