import { Request } from "express";
import { UserEntity } from "src/users/entities";

export interface RequestWithUser extends Request {
    user: UserEntity;
}