// src/pages/Register.jsx
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
  User,
  Phone,
  Car,
  Building,
  MapPin,
  Check
} from 'lucide-react'
import {useAuth} from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {register, userProfile} = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: searchParams.get('role') || 'owner',
    address: '',
    companyName: '',
    vehicleCount: 1
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

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
    }
  ]

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your full name')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email')
      return false
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
      }
      return
    }

    setLoading(true)
    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
        ...(formData.role === 'enterprise' && {
          companyName: formData.companyName,
          vehicleCount: parseInt(formData.vehicleCount)
        })
      })
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const progressSteps = [
    {number: 1, label: 'Account Details'},
    {number: 2, label: 'Complete Profile'}
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className='max-w-2xl w-full'>
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
              Create your account
            </p>
          </div>

          {/* Progress Steps */}
          <div className='flex items-center justify-center mb-8'>
            {progressSteps.map((progressStep, index) => (
              <div
                key={progressStep.number}
                className='flex items-center'>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step >= progressStep.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                  {step > progressStep.number ? (
                    <Check className='w-4 h-4' />
                  ) : (
                    progressStep.number
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step >= progressStep.number
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}>
                  {progressStep.label}
                </span>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      step > progressStep.number
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            {step === 1 && (
              <motion.div
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                className='space-y-6'>
                {/* Role Selection */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>
                    Register as
                  </label>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
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
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          formData.role === role.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}>
                        {role.icon}
                        <span className='text-sm font-medium text-center'>
                          {role.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      id='name'
                      name='name'
                      type='text'
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Enter your full name'
                    />
                  </div>
                </div>

                {/* Email */}
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

                {/* Phone */}
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone Number
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      id='phone'
                      name='phone'
                      type='tel'
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Enter your phone number'
                    />
                  </div>
                </div>

                {/* Password */}
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
                      type={
                        showPassword ? 'text' : 'password'
                      }
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Create a password'
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      id='confirmPassword'
                      name='confirmPassword'
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Confirm your password'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>
                      {showConfirmPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                className='space-y-6'>
                {/* Address */}
                <div>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Address
                  </label>
                  <div className='relative'>
                    <MapPin className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
                    <textarea
                      id='address'
                      name='address'
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
                      placeholder='Enter your address'
                    />
                  </div>
                </div>

                {/* Enterprise-specific fields */}
                {formData.role === 'enterprise' && (
                  <>
                    <div>
                      <label
                        htmlFor='companyName'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        Company Name
                      </label>
                      <input
                        id='companyName'
                        name='companyName'
                        type='text'
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                        placeholder='Enter company name'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='vehicleCount'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        Number of Vehicles
                      </label>
                      <select
                        id='vehicleCount'
                        name='vehicleCount'
                        value={formData.vehicleCount}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'>
                        {[
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                        ].map(num => (
                          <option
                            key={num}
                            value={num}>
                            {num} vehicle
                            {num > 1 ? 's' : ''}
                          </option>
                        ))}
                        <option value='10+'>
                          10+ vehicles
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {/* Terms and Conditions */}
                <div className='flex items-start space-x-3'>
                  <input
                    id='terms'
                    name='terms'
                    type='checkbox'
                    required
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1'
                  />
                  <label
                    htmlFor='terms'
                    className='text-sm text-gray-600'>
                    I agree to the{' '}
                    <a
                      href='#'
                      className='text-blue-600 hover:text-blue-500 font-medium'>
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a
                      href='#'
                      className='text-blue-600 hover:text-blue-500 font-medium'>
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </motion.div>
            )}

            <div className='flex gap-4'>
              {step === 2 && (
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors'>
                  Back
                </button>
              )}
              <button
                type='submit'
                disabled={loading}
                className={`${step === 2 ? 'flex-1' : 'w-full'} bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                {loading
                  ? 'Creating Account...'
                  : step === 1
                    ? 'Continue'
                    : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className='text-center mt-6'>
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <Link
                to={`/login?role=${formData.role}`}
                className='text-blue-600 hover:text-blue-500 font-medium'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
