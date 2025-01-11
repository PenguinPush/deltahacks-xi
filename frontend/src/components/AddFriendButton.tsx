export default function AddFriendButton() {
    
    function AddFriend() {
        console.log("adds friend");
    }
    return(
        <button onClick={AddFriend}>Add Friend</button>
    )
}