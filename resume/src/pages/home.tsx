// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import styled from 'styled-components';

// interface User {
//   full_name: string;
//   email: string;
// }

// interface JwtPayload {
//   user: User;
// }

// const Container = styled.div`
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background: #f5f7fa;
// `;w

// const Card = styled.div`
//   background: white;
//   padding: 40px;
//   border-radius: 10px;
//   width: 400px;
//   text-align: center;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
// `;

// const Avatar = styled.div`
//   width: 120px;
//   height: 120px;
//   border-radius: 50%;
//   background: #0a66c2;
//   color: white;
//   font-size: 48px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 20px;
// `;

// const Button = styled.button`
//   margin-top: 25px;
//   padding: 12px 30px;
//   background: #0a66c2;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
// `;

// export default function Home() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const decoded = jwtDecode<JwtPayload>(token);
//     setUser(decoded.user);
//   }, []);

//   const getInitials = (name: string) =>
//     name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase();

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   if (!user) return null;

//   return (
//     <Container>
//       <Card>
//         <Avatar>{getInitials(user.full_name)}</Avatar>

//         <h2>Welcome, {user.full_name}</h2>
//         <p>{user.email}</p>

//         <Button onClick={logout}>Logout</Button>
//       </Card>
//     </Container>
//   );
// }

import { useEffect, useState } from 'react';
// 1. Change the import from 'react-router-dom' to 'next/router'
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';

interface User {
  full_name: string;
  email: string;
}

interface JwtPayload {
  user: User;
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #0a66c2;
  color: white;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const Button = styled.button`
  margin-top: 25px;
  padding: 12px 30px;
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded.user);
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
      console.error(error);
    }
  }, [router]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <Container>
      <Card>
        <Avatar>{getInitials(user.full_name)}</Avatar>
        <h2>Welcome, {user.full_name}</h2>
        <p>{user.email}</p>
        <Button onClick={logout}>Logout</Button>
      </Card>
    </Container>
  );
}
