import Link from 'next/link';
import { Badge, Card } from 'antd';

const { Meta } = Card;

const CourseCard = ({ course }) => {
    const { name, instructor, image, slug, category } = course;
    
    return (
        <Link href={`/course/${slug}`}>
            <Card
                className='mb-5 mt-3'
                cover={
                    <img
                        className='p-2'
                        style={{ height: '300px', objectFit: 'cover' }}
                        src={image ? image.Location : "/course_default.png"}
                        alt={name} 
                    />
                }
            >
                <h2 className='font-weight-bold'>{name}</h2>
                <p>Created by {instructor.name}</p>
                <Badge style={{ backgroundColor:'#000080'}} className="pb-2 mr-2" count={category}/>
            </Card>

        </Link>
    )
};

export default CourseCard;