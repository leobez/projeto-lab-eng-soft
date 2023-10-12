import styles from './EditPostForm.module.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../../../Context/AuthContext'
import { useUpdateDocument } from '../../../Hooks/useUpdateDocument'

const EditPostForm = ({post, postId}) => {

	const auth = useContext(AuthContext)

	const maxcharlimit_title = 200
	const [title, setTitle] = useState("")
	const titleRef = useRef()
	const [titlecharcounter, setTitlecharcounter] = useState(0)
	useEffect(() => {
		if (title != null) {
			setTitlecharcounter(title.length)
		}
	}, [title])

	const maxcharlimit_desc = 1000
	const [description, setDescription] = useState("")
	const [descriptioncharcounter, setDescriptioncharcounter] = useState(0)
	useEffect(() => {
		if (description != null) {
			setDescriptioncharcounter(description.length)
		}
	}, [description])

	const [amountOfQuizLinks, setAmountOfQuizLinks] = useState(0)
	const quizContainerRef = useRef()

	const addQuiz = () => {
		const quiz_div = document.createElement("div")
		quiz_div.setAttribute("class", "quizcontainer")
		const quiz_label = document.createElement("label")
		quiz_label.setAttribute("for", `quiz_${amountOfQuizLinks}`)
		quiz_label.innerText = `Questionário ${amountOfQuizLinks+1}`

		const quiz_input = document.createElement("input")
		quiz_input.setAttribute("type", "text") // CHANGE TO URL
		quiz_input.setAttribute("name", `quiz_${amountOfQuizLinks}`)
		quiz_input.setAttribute("placeholder", "Digite o link para seu questionário")

		setAmountOfQuizLinks((prev) => prev+1)
		quiz_div.append(quiz_label, quiz_input)
		quizContainerRef.current.appendChild(quiz_div)
		return quiz_input
	}

	const removeQuiz = () => {
		quizContainerRef.current.removeChild(quizContainerRef.current.children[amountOfQuizLinks-1])
		setAmountOfQuizLinks((prev) => prev-1)
	}

	const [error, setError] = useState("")
	const {loading, apiError, updateDocument} = useUpdateDocument("posts")

	// Theses effects will set the initial values in the inputs
	useEffect(() => {
		setTitle(post.title)
		setDescription(post.description)
	}, [])

	const [cancelled, setCancelled] = useState(null)
	useEffect(() => {
		if (cancelled) return;

		const currentAmountOfLinks = Object.keys(post.quizLinks).length

		if (Number(amountOfQuizLinks) >= Number(currentAmountOfLinks)) {
			return () => setCancelled(true)
		}

		const quiz = addQuiz()
		const quizNumber = Number(quiz.name.replace("quiz_", ""))
		quiz.value = `${post.quizLinks[quizNumber]}`	

	}, [amountOfQuizLinks])

	const handleSubmit = async(e) => {
		e.preventDefault()
		setError("")

		// Create quizLinks obj
		const quizLinks = {}
		const quizInputs = document.querySelectorAll(".quizcontainer")

		quizInputs.forEach((value, key) => {
					if (value.lastChild.value.trim() !== "") {
						quizLinks[key] = value.lastChild.value
					}
				})
		

		if (
			title.trim() === "" || 
			title.trim() === undefined || 
			title.trim() === null ||
			description.trim() === "" || 
			description.trim() === undefined ||
			description.trim() === null
		) {
			setError("Preencha todos os campos.")
			return;
		}

		if (
			Object.keys(quizLinks).length <= 0 ||
			Object.keys(quizLinks).length === undefined ||
			Object.keys(quizLinks).length === null 
		) {
			setError("Você precisa divulgar ao menos um questionário.")
			return;
		}

		if (
			title.length > maxcharlimit_title ||
			description.length > maxcharlimit_desc
		) {
			setError("Limite de caracteres ultrapassado.")
			return;	
		}

		const newData = {
			title,
			description,
			quizLinks,
		}

		await updateDocument(postId, newData)
	}
	
	return (
		<>
			<form onSubmit={handleSubmit} className={styles.editpostform}>
				<div>
					<h1><span>Editando a postagem: {postId}</span></h1>
				</div>

				<div>
					<input 
						className={styles.inputtitle}
						type='text' 
						name='titulo'
						placeholder='Titulo'
						ref={titleRef}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<div className={styles.wordcounter}>
						{titlecharcounter <= maxcharlimit_title ? (
							<span>
								{titlecharcounter}/{maxcharlimit_title}
							</span>
						) : (
							<span className={styles.wordcounterlimitreached}>
								{titlecharcounter}/{maxcharlimit_title}
							</span>
						)}
					</div>
				</div>
					
				<div>
					<textarea 
						className={styles.inputdescription}
						type='text' 
						name='description'
						placeholder='Descrição'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div className={styles.wordcounter}>
						{descriptioncharcounter <= maxcharlimit_desc ? (
							<span>
								{descriptioncharcounter}/{maxcharlimit_desc}
							</span>
						) : (
							<span className={styles.wordcounterlimitreached} >
								{descriptioncharcounter}/{maxcharlimit_desc}
							</span>
						)}
					</div>
				</div>
	
				<div>
					<div className={styles.linksarea} ref={quizContainerRef}>
					</div>
					<hr />
					<div className={styles.buttonarea}>

						{amountOfQuizLinks < 10 &&
							<button type="button" onClick={addQuiz} className={styles.addquiz}>
								Adicionar Questionário +
							</button>
							}

						{amountOfQuizLinks > 0 &&
							<button type="button" onClick={removeQuiz} className={styles.removequiz}>
								Remover Questionário -
							</button>
						}
					</div>
				</div>

				<div>
					{!loading ? (<input type="submit" value="Editar"/>) : (<input type="submit" className="loadingButton" value="Editando..." disabled/>)}
				</div>
				
				<div className="error">
					{error && <p><span>{error}</span></p>}
					{apiError && <p><span>{apiError}</span></p>}
				</div>

			</form>
		</>
	)
}

export default EditPostForm