import { Wrapper } from './main';
import { useUser } from 'context/userContext';
import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/cart.module.css';
import Image from 'next/image';

export default function Main() {
    return (
        <Wrapper>
            <Cart />
        </Wrapper>
    );
}

export function Cart() {
    const { myUser } = useUser();
    const [ cart, setCart ] = useState(null);

    useEffect(() => {
        if(myUser.id){
            fetch(`https://dummyjson.com/carts/user/${myUser.id}`, myUser.req).then(res => res.json()).then(data => {
                console.log(data);
                setCart(data.carts[0]);
            });
        }
    }, [myUser]);

    return (
        <div>
            {cart && cart.products.map((product)=>(
                <div className={`${styles.item}`}>
                    <div style={{fontWeight: '600', fontSize: '1rem'}}>{product.title}</div>
                    <div className={`${styles.prices}`}>
                        <div style={{fontWeight: '400', fontSize: '1rem', color: 'grey'}}>${product.price}</div>
                        <div style={{fontWeight: '400', fontSize: '1rem', color: 'grey'}}> x{product.quantity}</div>
                    </div>
                </div>
            ))}
            {cart ? 
                <div className={`${styles.totals}`}>
                    <div>TOTAL:</div>
                    <div>${cart.total}</div>
                </div>
            : ''}
        </div>
    );
}
