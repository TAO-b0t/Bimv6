import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../redux/titleMap";
import Map from "./TemplatePage/Map";

export default function DocumentPages() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setTitle("แผนที่"))
    }, [])

    return (
        <Map/>
    )
}
