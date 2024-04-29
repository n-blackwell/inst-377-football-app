import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function HomeCard(props) {
    const { type, data, link } = props
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>Card {type}</Card.Title>
                <Card.Text>
                    {data}
                </Card.Text>
                <Button variant="primary">{link}</Button>
            </Card.Body>
        </Card>
    )
}

export default HomeCard