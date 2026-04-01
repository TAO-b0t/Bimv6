import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../redux/titleSlice";
import Documents from "./TemplatePage/Documents";

export default function DocumentPages() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setTitle("เริ่มต้นโครงการ"))
    }, [])

    return (
        <Documents/>
    )
}
