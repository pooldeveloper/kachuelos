'use client';

import { useParams } from "next/navigation";

export default function Page() {

    const { id } = useParams()

    console.log(id);
    return (
        <div>kachuelito</div>
    )
}

