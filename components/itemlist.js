import styles from '@/styles/itemlist.module.css';
import { useEffect, useState } from 'react';
import { useUser } from 'context/userContext';
import { Button } from 'devextreme-react/button';
import Image from 'next/image';

export default function ItemList () {
    const { myUser } = useUser();
    const [ skip, setSkip ] = useState(0);
    const [ data, setData ] = useState(null);
    
    useEffect(() => {
        fetch(`https://dummyjson.com/products?limit=10&skip=${skip}`, myUser.req).then(res => res.json()).then(data => {
            console.log(data);
            setData(data);
        });
    }, [myUser]);

    const fetchNext = () => {
        let newSkip = skip + 10;
        setSkip(newSkip);
        fetch(`https://dummyjson.com/products?limit=10&skip=${newSkip}`, myUser.req).then(res => res.json()).then(data => {
            console.log(data);
            setData(data);
            window.scrollTo(0, 0);
        });
    }

    const fetchPrev = () => {
        let newSkip = skip - 10;
        setSkip(newSkip);
        fetch(`https://dummyjson.com/products?limit=10&skip=${newSkip}`, myUser.req).then(res => res.json()).then(data => {
            console.log(data);
            setData(data);
            window.scrollTo(0, 0);
        });
    }

    const nextBtn = {
        text: 'Next',
        width: '100%',
        height: '40px',
        onClick: fetchNext,
    };

    const prevBtn = {
        text: 'Previous',
        width: '100%',
        height: '40px',
        onClick: fetchPrev,
    };
    
    return (
        <div>
            <div className={`${styles.itemGroup}`}>
                {data && data.products.map(item => (
                    <div key={item.id} className={`${styles.itemCard}`}>
                        <Image
                            src={item.thumbnail ? item.thumbnail : '/'}
                            alt={item.title}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className={`${styles.itemImage}`}
                        />
                        <div className={`${styles.cardInfo}`}>
                            <div className={`${styles.itemName}`}>{item.title}</div>
                            <div className={`${styles.itemPrice}`}>${item.price}</div>
                            <div className={`${styles.itemCategory}`}>{item.category}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${styles.buttonGroup}`}>
                <Button {...prevBtn} disabled={skip === 0 ? true : false}/>
                <Button {...nextBtn} disabled={(data && data.skip + data.limit >= data.total ? true : false)}/>
            </div>
        </div>
    );
}