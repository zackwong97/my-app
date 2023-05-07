import styles from '@/styles/topBar.module.css';
import { Button } from 'devextreme-react/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Popover } from 'devextreme-react/popover';
import dynamic from 'next/dynamic';
import ItemList from 'components/itemlist';
import { UserProvider, useUser } from 'context/userContext';

export default function Main() {
    return (
        <UserProvider>
            <TopBar />
        </UserProvider>
    );
}

export function TopBar () {
    const router = useRouter();
    const { myUser } = useUser();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    let buttonProps = {
        text: "logout",
        type: "danger",
        stylingMode: "outlined",
        width: '100%',
        onClick(e){
            sessionStorage.removeItem('user');
            router.push('/');
        }
    }

    let buttonCartProps = {
        icon: "cart",
        type: "normal",
        stylingMode: "outlined",
        onClick(e){
            console.log('cart');
        }
    }

    let userPopOver = {
        target: "#userProfile",
        showEvent: "click",
    };

    return (
    <>
        <div className={`${styles.topBar}`}>
            <div className={`${styles.userProfile}`} id="userProfile">
                <Image
                    src={myUser.image ? myUser.image : '/'}
                    width={40}
                    height={40}
                    alt="profile picture"
                    style={{ borderRadius: '50%', border: '1px solid lightgrey' }}
                />
                {isMounted && <Popover {...userPopOver}>
                    <div className={`${styles.name}`}>{myUser.firstName} {myUser.lastName}</div>
                    <Button {...buttonProps} />
                </Popover>}
            </div>
            <h3>Shoplee</h3>
            <Button {...buttonCartProps} />
        </div>
        <ItemList />
    </>
    );
}