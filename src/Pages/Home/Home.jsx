import React, { useContext, useEffect, useState } from 'react'
import styles from "./Home.module.css"
import AuthContext from '../../Context/AuthContext'
import { Link } from 'react-router-dom'
import { useGetDocuments } from '../../Hooks/useGet/useGetDocuments'
import Post from '../../Components/Post/Post'

const Home = ({isEmailVerified}) => {

	const auth = useContext(AuthContext)

	const {loading, apiError, getDocuments, listOfDocs} = useGetDocuments("posts")
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		console.log("CARREGAR CONTEUDO!")
		getDocuments()
	}, [refresh])

	const handleRefreshClick = () => {
		setRefresh(prev => !prev)
	}

	return (
		<div className={styles.home}>
		
			<div className={styles.homemenu}>
				<button onClick={handleRefreshClick} className={styles.refreshbutton}>
					<p>Recarregar</p>				
					<img src="..\src\assets\icons8-refresh-30.png" alt="refresh-icon" />
				</button>
				<p>
					Bem vindo ao Divulga Campo ! (Aqui ainda vai: barra de pesquisa, menu de categorias)
				</p>
			</div>

			<div className={styles.welcome}>

				{!auth.currentUser ? 
					(<div className={styles.welcomelinkstoauth}>
						{!auth.currentUser && <Link to="/register" className="nonNavLink">Cadastre-se</Link>}
						<p> OU </p>
						{!auth.currentUser && <Link to="/login" className="nonNavLink">Entre</Link>}
					</div>) :
					(
						<div className={styles.welcomelinkstopost}>
							<Link to="/createpost" className='nonNavLink'>Divulgue sua pesquisa de campo +</Link>
						</div>
					)
				}
			</div>

			<hr />

			<div className={styles.homecontentcontainer}>

				<div className={styles.homecontent}>
					{listOfDocs && listOfDocs.map((post) => (
						<Post key={post.postId} postData={post.postData} postId={post.postId}></Post>
					))}

					<div>
						<div className='loading'>
							{loading && <p>Carregando posts...</p>}
						</div>

						<div className="error">
							{apiError && <p>{apiError}</p>}
						</div>

						<div className="warn">
							{!loading && listOfDocs.length <= 0 && <p>Não há posts.</p>}
						</div>
					</div>
				</div>

			</div>
			
		</div>
	)
}

export default Home