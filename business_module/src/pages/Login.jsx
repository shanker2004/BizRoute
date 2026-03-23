import {useState, useEffect} from 'react'
import {
  Link,
  useSearchParams,
  useNavigate
} from 'react-router-dom'
import {motion} from 'framer-motion'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Car,
  Building,
  User
} from 'lucide-react'
import {useAuth} from '../contexts/AuthContext'

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {login, loginWithGoogle, userProfile} = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: searchParams.get('role') || 'owner'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userProfile) {
      navigate(`/${userProfile.role}`)
    }
  }, [userProfile, navigate])

  const roles = [
    {
      value: 'owner',
      label: 'Vehicle Owner',
      icon: <Car className='w-5 h-5' />
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      icon: <Building className='w-5 h-5' />
    },
    {
      value: 'driver',
      label: 'Driver',
      icon: <User className='w-5 h-5' />
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: <Lock className='w-5 h-5' />
    }
  ]

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.password)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle(formData.role)
    } catch (error) {
      console.error('Google login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <Link
              to='/'
              className='inline-block'>
              <h1 className='text-3xl font-bold text-gray-900'>
                Yantra{' '}
                <span className='text-blue-600'>
                  Kavasam
                </span>
              </h1>
            </Link>
            <p className='text-gray-600 mt-2'>
              Sign in to your account
            </p>
          </div>

          {/* Role Selection */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Login as
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {roles.map(role => (
                <button
                  key={role.value}
                  type='button'
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      role: role.value
                    }))
                  }
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    formData.role === role.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}>
                  {role.icon}
                  <span className='text-sm font-medium'>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  placeholder='Enter your email'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <span className='ml-2 text-sm text-gray-600'>
                  Remember me
                </span>
              </label>
              <Link
                to='/forgot-password'
                className='text-sm text-blue-600 hover:text-blue-500 font-medium'>
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className='my-6 flex items-center'>
            <div className='flex-1 border-t border-gray-200'></div>
            <span className='px-3 text-sm text-gray-500'>
              Or continue with
            </span>
            <div className='flex-1 border-t border-gray-200'></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className='w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
            <img
              src='/google.svg'
              alt='Google'
              className='w-5 h-5'
            />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link
                to={`/register?role=${formData.role}`}
                className='text-blue-600 hover:text-blue-500 font-medium'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
