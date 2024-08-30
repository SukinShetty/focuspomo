/**
 * v0 by Vercel.
 * @see https://v0.dev/t/a94tOBLwEzo
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpForm() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
      <div className="w-full max-w-sm space-y-2">
        <div className="space-y-2 text-center">
          <div className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
          </div>
        </div>
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Sign Up</Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs">
              By clicking Sign Up, you agree to our{" "}
              <Link href="#" className="underline" prefetch={false}>
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="#" className="underline" prefetch={false}>
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="#" className="underline" prefetch={false}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}