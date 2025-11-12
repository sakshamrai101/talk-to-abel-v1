import React from 'react'
import { useRouter } from 'next/router'
import signUp from 'fb/auth'
import signIn, { signInWithGoogle } from 'fb/signin'
import { makeStyles } from '@material-ui/core/styles'
import Image from 'next/image'
import Button from '@mui/material/Button'

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: 'fixed',
    right: '50%',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  paper: {
    width: '400px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: '30px',
    borderRadius: '20px',
    outline: 'none',
  },
  modal: {
    padding: '30px',
    borderRadius: '8px',
    border: 'none',
    zindex: '100 !important',
    textAlign: 'center',
    maxHeight: '70vh',
    width: '400px',
    overflowY: 'scroll',
    position: 'fixed',
    top: '50%',
    left: '50%',
    backgroundColor: 'linear-gradient(180deg, #ffffff 0%, #03ade6 100%)',
    transform: 'translate(-50%, -30%)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 500,
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '15px 20px',
    border: '1px solid #ddd',
    borderRadius: '15px',
    fontSize: '16px',
    width: '90%',
    margin: '0 auto',
  },
  submitButton: {
    padding: '15px 20px',
    border: 'none',
    borderRadius: '15px',
    color: '#ffffff',
    backgroundColor: 'var(--primary)',
    cursor: 'pointer',
    fontSize: '16px',
    transition: '0.3s',
    width: '80%',
    margin: '0 auto',

    '&:hover': {
      backgroundColor: 'var(--primary)',
    },
  },
}))

interface LoginModalProps {
  closeLoginModal: () => void
  name: string | null
}

const LoginModal = ({ name, closeLoginModal }: LoginModalProps) => {
  const classes = useStyles()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(true)
  const router = useRouter()
  const [isSignUp, setIsSignUp] = React.useState(true)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    closeLoginModal()
  }

  const handleSignUp = async (event: any) => {
    event.preventDefault()

    const { result, error } = await signUp(email, password)

    if (error) {
      return console.log(error)
    }

    console.log(result)
    handleClose()
    return router.push('/')
  }
  const handleSignIn = async (event: any) => {
    event.preventDefault()

    const { result, error } = await signIn(email, password)

    if (error) {
      return console.log(error)
    }

    console.log(result)
    handleClose()
    return router.push('/')
  }

  const handleSignInWithGoogle = async (event: any) => {
    event.preventDefault()

    const { result, error } = await signInWithGoogle()
    if (error) {
      return console.log(error)
    }
  }

  const handleForm = isSignUp ? handleSignUp : handleSignIn

  return (
    <div>
      <dialog open={true} className={classes.modal}>
        <h1 className={classes.title}>{isSignUp ? 'Sign up' : 'Sign in'}</h1>
        <form onSubmit={handleForm} className={classes.form}>
          <label htmlFor="email">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className={classes.input}
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className={classes.input}
            />
          </label>
          <button type="submit" className={classes.submitButton}>
            {isSignUp ? 'Sign up' : 'Sign in'}
          </button>
          <p>or</p>
          <Button className="googleSignIn" onClick={handleSignInWithGoogle}>
            <Image
              className="googleIcon"
              src="/GoogleLogo.png"
              alt="google icon"
              width={50}
              height={50}
            />{' '}
            Sign in with Google
          </Button>
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <a className="login-switch" onClick={() => setIsSignUp(false)}>
                Sign in
              </a>
            </p>
          ) : (
            <p>
              Dont have an account?{' '}
              <a className="login-switch" onClick={() => setIsSignUp(true)}>
                Sign up for a FREE account!
              </a>
            </p>
          )}
        </form>

        <span
          className="material-symbols-outlined closePanelButton"
          onClick={handleClose}
        >
          close
        </span>
        {/* show google Icon */}
      </dialog>
    </div>
  )
}

export default LoginModal
