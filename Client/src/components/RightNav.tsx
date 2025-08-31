const RightNav = () => {
  return (
    <nav className="hidden md:block w-[360px] border-l border-neutral-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex p-1 font-medium">
      <div className="pl-3 mt-1">Friends</div>

      <div className="flex flex-row items-center hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-neutral-400 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 
      7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 
      0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 
      0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 
      3 3 0 0 1 6 0Z"
          />
        </svg>
        Friend Name
      </div>
      <div className="flex flex-row items-center hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-neutral-400 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 
      7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 
      0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 
      0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 
      3 3 0 0 1 6 0Z"
          />
        </svg>
        Friend Name
      </div>
      <div className="flex flex-row items-center hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 px-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-neutral-400 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 
      7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 
      0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 
      0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 
      3 3 0 0 1 6 0Z"
          />
        </svg>
        Friend Name
      </div>


    </nav>
  )
}

export default RightNav