import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { verifyKhaltiPayment } from '../store/paymentSlice'
import { emptyCart } from '../store/cartSlice'
import { Link } from 'react-router-dom'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()  

  const pidx = searchParams.get('pidx')

  useEffect(() => {
    if (pidx) {
      // Verify payment with pidx
      dispatch(verifyKhaltiPayment(pidx))
        .then((result) => {
          if (result.success) {
            // Clear cart after successful payment
            dispatch(emptyCart())
          }
        })
        .catch((error) => {
          console.error('Payment verification error:', error)
        })
    }
  }, [pidx, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/orders"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

