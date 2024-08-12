import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import style from './Header.module.css'

export default function Header() {
  const { currentuser } = useSelector(state => state.user);
  return (
    <header className={`shadow-md ${style.header}`} >
      <div className="flex justify-between item-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex-wrap">
            <span className="text-slate-500">Ali </span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          ></input>
          <FaSearch className="text-slate-600"></FaSearch>
        </form>
        <ul className="flex gap-4">
          <Link to="home">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {
              currentuser ? (<img className='rounded-full h-8 w-8 object-cover' src={currentuser.avatar} alt='profile'/>

            ): <li className=" text-slate-700 hover:underline">
              Sign In
            </li>
          }
          
           
</Link>
        </ul>
      </div>
    </header>
  );
}
