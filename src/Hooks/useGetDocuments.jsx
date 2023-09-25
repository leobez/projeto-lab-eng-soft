import { useEffect, useState } from "react"
import {db} from "../firebase/config"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"


export const useGetDocuments = (collectionName) => {

	const [loading, setLoading] = useState(false)
	const [apiError, setApiError] = useState("")
	const [docs, setDocs] = useState([])
	const navigate = useNavigate()
	const [cancelled, setCancelled] = useState(false)

	const getDocuments = async() => {

		if (cancelled) return;

		try {
			setLoading(true)
			const col = collection(db, collectionName)
			const q = query(col, orderBy('createdAt', 'desc'))
			const querySnapshot = await getDocs(q)

			let list = []
			await querySnapshot.forEach(doc => {
				list.push({postData: doc.data(), postId: doc.id})
			});

			setLoading(false)
			return list

		} catch (error) {
			setApiError(error)
			setLoading(false)
		}
	}

	const getDocumentsByUid = async(uid) => {

		if (cancelled) return;

		try {
			setLoading(true)
			const col = collection(db, collectionName)
			const q = query(col, where("uid", "==", uid))
			const querySnapshot = await getDocs(q)

			let list = []
			await querySnapshot.forEach(doc => {
				list.push({postData: doc.data(), postId: doc.id})
			});

			setLoading(false)
			return list

		} catch (error) {
			setApiError(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		return () => setCancelled(true)
	}, [])

	return {
		loading, 
		apiError,
		getDocuments,
		getDocumentsByUid
	}
}