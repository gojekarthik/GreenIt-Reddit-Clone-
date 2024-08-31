import { atom, RecoilState } from "recoil";

export const emailAtom:RecoilState<string> = atom({
    key:"emailAtom",
    default:""
})

export const passwordAtom:RecoilState<string> = atom({
    key:"passwordAtom",
    default:""
})