import { Request, Response, NextFunction } from "express";
import { userInfo } from './userInfo'
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const User = require("../models/User");
const {
  createResponse,
  responseLogger,
  HttpStatusCode,
  ResponseStatus,
} = require("../common");

require("dotenv").config();

module.exports = async (req: userInfo, res: Response, next: NextFunction) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization) {
      return createResponse(
        res,
        HttpStatusCode.StatusUnauthorized,
        ResponseStatus.Error,
        `Authorization token is invalid`
      );
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return createResponse(
        res,
        HttpStatusCode.StatusUnauthorized,
        ResponseStatus.Error,
        `Authorization token is missing`
      );
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id)
      .select("-transactionPin -password")
      .populate("securityQuestions.question");
    const logUser = _.pick(user, [
      "status",
      "isPhoneNumberVerified",
      "isBiometricActivated",
      "firstname",
      "lastname",
      "dob",
      "email",
      "phone",
      "nuban",
      "username",
      "blockchain",
      "country",
      "telephoneCode",
      "gender",
      "createdAt",
      "id",
    ]);

    responseLogger(module).info(`Logged in user ${JSON.stringify(logUser)}`);

    if (!user || (user && user.accessToken !== token)) {
      return createResponse(
        res,
        HttpStatusCode.StatusUnauthorized,
        ResponseStatus.Error,
        `Failed to authenticate user`
      );
    }

    // if (user.status === 'UNVERIFIED') {
    //   return createResponse(
    //     res,
    //     HttpStatusCode.StatusBadRequest,
    //     ResponseStatus.Failure,
    //     `User account has not been verified`
    //   );
    // }

    if (user.status === "BLOCKED") {
      return createResponse(
        res,
        HttpStatusCode.StatusBadRequest,
        ResponseStatus.Failure,
        `User account has been blocked`
      );
    }

    if (user.status === "DEACTIVATED") {
      return createResponse(
        res,
        HttpStatusCode.StatusBadRequest,
        ResponseStatus.Failure,
        `User account has been deactivated`
      );
    }
    req.user = user;
    next();
  } catch (error: any) {
    return createResponse(
      res,
      HttpStatusCode.StatusInternalServerError,
      ResponseStatus.Error,
      `Error: ${error.message}`
    );
  }
};
