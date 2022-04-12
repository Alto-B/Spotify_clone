import {Card} from 'react-bootstrap';
import { msToHMS } from '../../Helper/helper';

const styles = {
    card: {
        display: "flex",
        flexDirection: 'row'
    },
    cardImage: {
        width: '150px',
        height: '150px'
    },
    info:{
        width: '200px',
    }
}

const Item = ({item}) =>{

    let desc; 
    if(item.followers != null){
        desc = (<div>
            <Card.Text>{`Followers: ${item.followers}`}</Card.Text>
        </div>);
    }else if(item.total_songs != null){
        desc = (
            <div>
                <Card.Subtitle className="mb-2 text-muted">{item.date}</Card.Subtitle>
                <Card.Text  >
                    Total Songs: {item.total_songs} 
                    <br/>
                    Artist(s): {item.art_name}
                    </Card.Text>
            </div>
        );
    }else if (item.lyrics != null){
        desc = (
            <div>
                <Card.Subtitle className="mb-2 text-muted">{item.alb_name}</Card.Subtitle>
                <Card.Text>{msToHMS(item.duration)}</Card.Text>
            </div>
        );
    }
    
    return (
        <Card key={item.id} style={styles.card} >
            <Card.Img src={item.img} style={styles.cardImage}/>
            <Card.Body>
                <Card.Title>{item.song_name || item.alb_name || item.art_name}</Card.Title>
                {desc}
            </Card.Body>
        </Card>
    );
}

export default Item; 