import { useState, useEffect } from 'react'

function ArtInfo({key, image, title, artist, medium, culture, date}) {
    return (
        <tr key={key}>
            <td><img src={image}></img></td>
            <td>{title}</td>
            <td>{artist}</td>
            <td>{medium}</td>
            <td>{date}</td>
            <td>{culture}</td>
        </tr>
    );
}

export default ArtInfo