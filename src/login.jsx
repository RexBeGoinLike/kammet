import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../netlify/functions/usermanager.js'


export function Login() {

  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  function emailHandler(e){
    setEmail(e.target.value);
  }

  function passwordHandler(e){
    setPassword(e.target.value);
  }

  const navigate = useNavigate();

  async function submitEvent(e){
    try{
      await signIn(e, email, password);    
      setEmail("");
      setPassword("");
      navigate('/home');
    }catch (error) {
      alert("Invalid Credentials!");
    }
  }

  return (
    <>
      <h1>Freaky Ass Logo</h1>
      <form onSubmit={submitEvent}>
          <input
            type="text" 
            value={email}
            onChange={emailHandler}
          />
          <input
            type="password" 
            value={password}
            onChange={passwordHandler}
          />
          <input
            type="submit"
          />
      </form>
    </>
  );
}
