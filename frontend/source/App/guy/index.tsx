import { useState, useEffect } from 'react';

interface Props {
    frame: string;
}

export function Guy({frame}:Props) {
    return (
        <div className='flex w-fit h-full justify-center'>
            <img className='h-full' src={frame}></img>
        </div>
    );

}