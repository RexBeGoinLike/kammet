import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function StoreItemList(){
    return (
        <>
        <GenerateStoreItemList />
        </>
    );
}

function GenerateStoreItemList(){

    const [items, setItems] = useState([]);
    const { id } = useParams();
    
    useEffect(() => {
        fetch(`/.netlify/functions/getStoreItemList?id=${id}`)
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch((err) => console.error(err));
    }, []);

    return (<div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>{item.price}</p>
        </div>
      ))}
    </div>
    );
}