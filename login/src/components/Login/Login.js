import React, 
{ 
  useRef,  
  useState, 
  useEffect, 
  useReducer, 
  useContext } from 'react'; 

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'USER_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'USER_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};


const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: null });
  
  
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  const ctx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();


  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!')
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 100);

    return () => {
      console.log('CLEANUP!')
      clearTimeout(identifier);
    }
  }, [emailIsValid, passwordIsValid]);
  
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'USER_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'USER_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);      
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>

        <Input  
          id={"email"}
          ref={emailInputRef} 
          type={"email"} 
          label={"E-Mail"} 
          value={emailState.value} 
          isValid={emailIsValid} 
          onChange={emailChangeHandler} 
          onBlur={validateEmailHandler}/>

        <Input  
          id={"password"} 
          ref={passwordInputRef}
          type={"password"} 
          label={"Password"} 
          value={passwordState.value} 
          isValid={passwordIsValid} 
          onChange={passwordChangeHandler} 
          onBlur={validatePasswordHandler}/>

        <div className={classes.actions}>
          <Button 
            type="submit" 
            className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
