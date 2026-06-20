import { useState, useRef, useEffect } from "react";
import { getProblem } from "../../utils/getProblems";
import { CLICK_DEBOUNCE } from "../../constants/mapConfig"
import { getAddress } from "../../utils/getAddress";
import ForumComment from "./ForumComment";
import { formatAddress } from '../../utils/formatResponse';
import { getForumComments } from "../../utils/forumComment";

function PointPanel({ point, onClose }) {
  const [problemLoading, setProblemLoading] = useState(true);
  const [problem, setProblem] = useState(null);
  const [address, setAddress] = useState(null);
  const skipAddressRef = useRef(false);
  const addressKeyRef = useRef(0);
  const [showForumComment, setShowForumComment] = useState(false);
  const [comments, setComments] = useState([]);
  const commentsEndRef = useRef(null);
  const prevCommentsLength = useRef(0);

  useEffect(() => {
    if (!point) return;

    setAddress(null);

    if (skipAddressRef.current) {
      skipAddressRef.current = false;
      return;
    }

    const key = ++addressKeyRef.current;
    const lat = point.coordsLat ?? point.lat;
    const lng = point.coordsLng ?? point.lng;
    const timer = setTimeout(async () => {
      const addr = await getAddress(lat, lng);
      if (key === addressKeyRef.current) setAddress(addr);
    }, CLICK_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [point]);

  useEffect(() => {
    if (point?.category === "problem") {
      setProblemLoading(true);
      setProblem(null);
      getProblem(point.problemId).then(data => {
        if (data) setProblem(data);
        setProblemLoading(false);
      });
    }

    if (point?.category === "forumPosts") {
      setComments([]);
      prevCommentsLength.current = 0;
      getForumComments(point.id).then(data => {
        if (data) {
          prevCommentsLength.current = data.length;
          setComments(data);
        }
      });
    }
  }, [point]);

  useEffect(() => {
    if (comments.length > prevCommentsLength.current) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCommentsLength.current = comments.length;
  }, [comments]);

  if (!point) return null;

  const formattedAddress = formatAddress(address);

  return (
    <>
    <div className="overflow-y-auto overflow-x-hidden panel absolute left-3 top-26 p-4 text-sm w-[16vw] max-h-[56vh] max-w-[16vw]">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase" ref={commentsEndRef}>{point.category === 'problem' ? 'report' : point.category} </span>
        <button onClick={onClose} className="cursor-pointer">✕</button>
      </div>

      {point.category === "problem" && (
        problemLoading ? (<span className="font-bold">Loading... </span>) :
        !problem ? (<span className="font-bold">Failed to load information of report.</span>) : (
          <>
            <p><span className="font-bold">Registered on: </span>{problem.regDate}</p>
            <p><span className="font-bold">Lat: </span>{problem.coordsLat.toFixed(5)}</p>
            <p><span className="font-bold">Lng: </span>{problem.coordsLng.toFixed(5)}</p>
            <p><span className="font-bold">Location:</span> {address === null ? 'Loading...' : formattedAddress ?? 'Address unavailable'}</p>
            <p><span className="font-bold">Type:</span> {problem.problemTypeString}</p>
            <p><span className="font-bold">ID:</span> {problem.problemId}</p>
            {problem.description &&
              (<p><span className="font-bold break-words">Description:</span> {problem.description}</p>)
            }
            {problem.answer &&
              (<p><span className="font-bold break-words">Answer:</span> {problem.answer}</p>)
            }
            {problem.problemFiles?.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {problem.problemFiles.map((file, i) => (
                  <img
                    key={i}
                    src={file.filePath}
                    alt={file.fileName}
                    className="w-full rounded"
                  />
                ))}
              </div>
            )}
          </>
        )
      )}

      {point.category === "forumPosts" && (
        <>
          <p><span className="font-bold">Lat: </span>{point.coordsLat.toFixed(5)}</p>
          <p><span className="font-bold">Lng: </span>{point.coordsLng.toFixed(5)}</p>
	  <p><span className="font-bold break-words">Author: </span>{point.userFname} {point.userLname}</p>
          <p><span className="font-bold">Location:</span> {address === null ? 'Loading...' : formattedAddress ?? 'Address unavailable'}</p>
          <p><span className="font-bold break-words">Title: </span>{point.title}</p>
          <p><span className="font-bold break-words">Description: </span>{point.content}</p>

          {comments.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="font-bold text-xs mb-2" >Comments</p>
              {comments.map((comment, i) => (
                <div key={i} className="mb-2 border-b pb-1">
                  <p className="text-xs break-words mb-0.5">{comment.userFirstName} {comment.userLastName}</p>
                  <p className="text-xs break-words">{comment.content}</p>
                </div>
              ))}
              <div/>
            </div>
          )}

          {point.coordsLat !== null && (
            <button
              onClick={() => setShowForumComment(true)}
              className="cursor-pointer mt-2 w-full mb-2 py-1 rounded bg-primary text-white text-xs hover:bg-secondary"
            >
              Write a comment
            </button>
          )}
        </>
      )}

      {point.category === "school" && (
        <>
          <p><span className="font-bold">Name: </span> {point.institutionName}</p>
          <p><span className="font-bold">Lat: </span>{point.lat.toFixed(5)}</p>
          <p><span className="font-bold">Lng: </span>{point.lng.toFixed(5)}</p>
          <p><span className="font-bold">Location:</span> {address === null ? 'Loading...' : formattedAddress ?? 'Address unavailable'}</p>
        </>
      )}
    </div>
    {showForumComment && (
      <ForumComment
        onClose={() => {
          setShowForumComment(false);
          getForumComments(point.id).then(data => { if (data) setComments(data); });
        }}
        coordsLat={point.coordsLat}
        coordsLng={point.coordsLng}
        postId={point.id}
      />
    )}
  </>
  );
}

export default PointPanel;
