import styles from '@/styles/itemlist.module.css';
import { useEffect, useState, useRef } from 'react';
import { useUser } from 'context/userContext';
import { Button } from 'devextreme-react/button';
import Image from 'next/image';
import TextBox from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import DataSource from 'devextreme/data/data_source';

export default function ItemList () {
    const { myUser } = useUser();
    const [ skip, setSkip ] = useState(0);
    const [ data, setData ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const catSelectRef = useRef(null);
    const searchBoxRef = useRef(null);
    const sortSelectRef = useRef(null);
    
    
    useEffect(() => {
        fetch(`https://dummyjson.com/products?limit=10&skip=${skip}`, myUser.req).then(res => res.json()).then(data => {
            console.log(data);
            setData(data);
        });
        fetch(`https://dummyjson.com/products/categories`, myUser.req).then(res => res.json()).then(data => {
            console.log(data);
            setCategories(data.map((cat, idx) => ({id: idx, val: cat})));
        });
    }, [myUser]);

    const fetchItems = (page, query = {}) => {
        console.log(query);
        let newSkip = skip + page;
        setSkip(newSkip);
        let url = `https://dummyjson.com/products`;
        if(query.q) url = url + `/search?limit=10&skip=${newSkip}&${query.q}`;
        else if (query.cat) url = url + `/category/${query.cat}?limit=10&skip=${newSkip}`;
        else url = url + `?limit=10&skip=${newSkip}`;
        fetch(url, myUser.req).then(res => res.json()).then(data => {
            console.log(data);
            setData(data);
            window.scrollTo(0, 0);
            if(sortSelectRef){
                let sortSelect = sortSelectRef.current.instance;
                if(sortSelect.option('value')){
                    let val = sortSelect.option('value');
                    sortSelect.reset();
                    sortSelect.option('value', val);
                }
            }
        });
    }

    const nextBtn = {
        text: 'Next',
        width: '100%',
        height: '40px',
        onClick: () => fetchItems(10),
    };

    const prevBtn = {
        text: 'Previous',
        width: '100%',
        height: '40px',
        onClick: () => fetchItems(-10),
    };

    const textBox = {
        mode: 'search',
        onValueChanged(e){
            if(e.value){
                catSelectRef.current.instance.reset();
                fetchItems((skip * -1), {q: 'q='+e.value});
            }else{
                if(!catSelectRef.current.instance.option('value')) fetchItems((skip * -1));
            }
            sortSelectRef.current.instance.reset();
        }
    };

    const selectCat = {
        dataSource: new DataSource({
            store: {
              data: categories,
              type: 'array',
              key: 'id',
            },
        }),
        placeholder: 'Category',
        displayExpr: 'val',
        valueExpr: 'val',
        searchEnabled: true,
        showClearButton: true,
        onValueChanged(e){
            if(e.value){
                searchBoxRef.current.instance.reset();
                fetchItems((skip * -1), {cat: e.value});
            }else{
                if(!searchBoxRef.current.instance.option('value')) fetchItems((skip * -1));
            }
            sortSelectRef.current.instance.reset();
        }
    };

    const selectSort = {
        dataSource: new DataSource({
            store: {
              data: [{val: 'Relevance'},{val: 'Price ⬆️'},{val: 'Price ⬇️'}],
              type: 'array',
              key: 'val',
            },
        }),
        displayExpr: 'val',
        valueExpr: 'val',
        showClearButton: true,
        onValueChanged(e){
            let ds = new DataSource({
                store: {
                  data: data.products,
                  type: 'array',
                  key: 'id',
                },
            });
            if(e.value == 'Relevance'){
                ds.sort({ selector: "rating", desc: true });
            }else if(e.value == 'Price ⬆️'){
                ds.sort({ selector: "price", desc: false });
            }else if(e.value == 'Price ⬇️'){
                ds.sort({ selector: "price", desc: true });
            }else{
                ds.sort({ selector: "id", desc: false });
            }
            ds.load().then(sData => {
                setData({...data, products: sData});
            });
        }
    };
    
    return (
        <div>
            <div className={`${styles.searchBar}`}>
                <TextBox ref={searchBoxRef} {...textBox}/>
            </div>
            <div className={`${styles.buttonGroup}`}>
                <SelectBox ref={catSelectRef} {...selectCat}/>
                <SelectBox ref={sortSelectRef} {...selectSort}/>
            </div>
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
                            <div className={`${styles.itemRating}`}>{item.rating} ⭐</div>
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