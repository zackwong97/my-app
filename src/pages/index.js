import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {Form, SimpleItem, RequiredRule, Item} from 'devextreme-react/form';
import { useRef, useEffect } from 'react';
import notify from 'devextreme/ui/notify';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  const myFormRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if(user){
      router.push('/main');
    }
  }, []);

  const buttonOptions = {
    text: "Login",
    type: "success",
    width: "100%",
    height: '50px',
    onClick(e) {
      const dxForm = myFormRef.current.instance;
      if(!dxForm.validate().isValid) return;
      e.component.option('disabled', true);
      const formData = dxForm.option('formData');
      fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then((msg)=>{
        console.log(msg);
        e.component.option('disabled', false);
        if(!msg.token){
          notify({message: 'Invalid Credentials', type: 'error'}, { position: "top center", direction: "down-push" });
          return;
        }
        sessionStorage.setItem("user", JSON.stringify(msg));
        router.push('/main');
      });
    }
  };

  const usernameOptions = {
    height: '50px',
  };

  const passwordOptions = {
    height: '50px',
    mode: "password",
  };

  return (
    <>
      <Head>
        <title>Shop App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1 className={`${styles.loginTitle}`}>Login</h1>
        <Form ref={myFormRef}
            id="myForm"
            labelMode="floating"
            colCount={1}
            width="100%"
        >
          <SimpleItem dataField="username" editorType="dxTextBox" editorOptions={usernameOptions}>
            <RequiredRule />
          </SimpleItem>
          <SimpleItem dataField="password" editorType="dxTextBox" editorOptions={passwordOptions}>
            <RequiredRule />
          </SimpleItem>
          <Item itemType="button" buttonOptions={buttonOptions} />
        </Form>
      </main>
    </>
  )
}
