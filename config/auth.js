import { Strategy as LocalStrategy } from "passport-local"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

export default function (passport) {

    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            (email, password, done) => {

                User.findOne({ email: email })
                    .then((user) => {

                        if (!user) {
                            return done(null, false, {
                                message: "Essa conta não existe"
                            })
                        }

                        bcrypt.compare(
                            password,
                            user.password,
                            (error, isMatch) => {

                                if (error) {
                                    return done(error)
                                }


                                if (isMatch) {
                                    return done(null, user)
                                }


                                return done(null, false, {
                                    message: "Senha incorreta"
                                })

                            }
                        )

                    })
                    .catch((error) => done(error))

            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
                done(null, user)
            })
            .catch((error) => {
                done(error, null)
            })
    })

}