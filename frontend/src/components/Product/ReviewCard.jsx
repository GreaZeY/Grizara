import React from 'react'
import { Rating } from "@material-ui/lab";
import profilePic from "../../images/Profile.png"
const ReviewCard = ({review}) => {

    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5,
        color:"#FF007A"
      };
    return (
        <div className="reviewCard">
            <img src={profilePic} alt="user Pic"/>
            <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
        </div>
    )
}

export default ReviewCard
