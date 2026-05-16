import './App.css'
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const handleClick = async () => {
  //   try {
  //     const res = await AuthApi.post("/auth/login", {
  //       email,
  //       password,
  //     });

  //     console.log(res.data);
      
  //   } 
    
  //   catch (error) {
  //     console.error(error);
  //   } 
    
  //   finally {
  //     setEmail("");
  //     setPassword("");
  //   }
  // };

  return ( 
    // <>
    //   <label>Username</label>
    //   <input
    //       type="text"
    //       value={email}
    //       placeholder="Enter email"
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <input
    //       type="password"
    //       value={password}
    //       placeholder="Enter password"
    //       onChange={(e) => setPassword(e.target.value)}
    //     />

    //     <button onClick={() => handleClick()}>Submit</button>
    // </>
    <>
      <LoginForm></LoginForm>
      <RegisterForm></RegisterForm>
    </>
  )
}

export default App
