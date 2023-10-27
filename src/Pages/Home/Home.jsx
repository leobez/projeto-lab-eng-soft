import React, { useContext, useEffect, useState } from 'react'
import styles from "./Home.module.css"
import AuthContext from '../../Context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useGetDocuments } from '../../Hooks/useGet/useGetDocuments'
import Post from '../../Components/Post/Post'
import { Timestamp } from 'firebase/firestore'

const Home = () => {

	const auth = useContext(AuthContext)
	const navigate = useNavigate()

	const {loading, apiError, getNonExpiredDocuments, listOfDocs} = useGetDocuments("posts")
	const [refresh, setRefresh] = useState(false)

	const [searchQuery, setSearchQuery] = useState("")

	const handleSearch = (e) => {
		e.preventDefault()
		if (searchQuery.trim() === "") {
			console.log("nada")
			return;
		} 
		console.log(searchQuery)
		navigate(`search?q=${searchQuery}`)
	}

	useEffect(() => {
		getNonExpiredDocuments()
	}, [refresh])

	const handleRefreshClick = () => {
		setRefresh(prev => !prev)
	}


	return (
		<div className={styles.home}>
			<div className={styles.homemenu}>

				<div>
					<p>
						<span>Bem vindo ao Divulga Campo !</span>
					</p>
				</div>

				<div>
					<button onClick={handleRefreshClick} className={styles.refreshbutton}>
						<p>Recarregar</p>				
						<img src="..\src\assets\icons8-refresh-30.png" alt="refresh-icon" />
					</button>

					<div className={styles.searchbarcontatiner}>
						<form onSubmit={handleSearch}>
							<div>
								<input 
								type="text" 
								name="searchQuery" 
								id="searchQuery" 
								placeholder='Pesquisa...'
								onChange={(e) => setSearchQuery(e.target.value)}/>
							</div>
							<input type="submit" value="Pesquisar" />
						</form>
					</div>
				</div>
			</div>

			<div className={styles.welcome}>

				{!auth.currentUser ? 
					(<div className={styles.welcomelinkstoauth}>
						{!auth.currentUser && <Link to="/register" >Cadastre-se</Link>}
						<p> OU </p>
						{!auth.currentUser && <Link to="/login" >Entre</Link>}
					</div>) :
					(
						<div className={styles.welcomelinkstopost}>
							<Link to="/createpost" >Divulgue sua pesquisa de campo +</Link>
						</div>
					)
				}
			</div>

			<div className={styles.homecontentcontainer}>

				<div className={styles.homecontent}>
					{listOfDocs && listOfDocs.map((post) => (
						<Post key={post.postId} postData={post.postData} postId={post.postId}></Post>
					))}

					<div>
						<div>
							{loading && <p>Carregando posts...</p>}
						</div>

						<div>
							{apiError && <p>{apiError}</p>}
						</div>

						<div>
							{!loading && listOfDocs.length <= 0 && <p>Não há posts.</p>}
						</div>
					</div>
				</div>

			</div>
			
		</div>
	)
}

export default Home