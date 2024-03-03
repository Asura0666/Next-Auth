import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password -createdAt -updatedAt -__v");

        return NextResponse.json({
            mesaaage: "User found",
            data: user,
            success: true
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}