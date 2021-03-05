const SearchBar = ({handleSearchInput}) => {

  const handleChange = (e)  => {
    console.log('handle change called')
    handleSearchInput(e)
  }

  return (
    <>
      <input className='search-bar-input' type="text" onChange={(e) => {handleChange(e)}}/>
    </>
  );
};

export default SearchBar;
