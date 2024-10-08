import { useEffect, useState } from "preact/hooks";

export function App() {
  const [value, setValue] = useState<null | string>(null);
  const [bookmarkName, setBookmarkName] = useState<null | string>("Link");
  const SITE_URL = "http://" + window.location.host;

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Update bookmarklet JS on value change
  useEffect(() => {
    const GENERATE_LINK = document.getElementById("generate-link");
    const BOOKMARKLET_CODE = `javascript: (() => {const url = '${SITE_URL}/?copyParam=${value}';myWindow=window.open(url, '_blank', 'width=200, height=200');myWindow.document.close();})();`;
    (GENERATE_LINK! as HTMLAnchorElement).href = BOOKMARKLET_CODE;
  }, [value]);

  // On page load if copyParam in url then copy to clipboard else copy init text
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Timeout needed for url params to be loaded
    setTimeout(() => {
      if (!urlParams.has("copyParam")) {
        // First page access request copy access
        document.execCommand("copy");
        navigator.clipboard.writeText("InitCopyParam");
      } else {
        // Comming from bookmark overwrite copy body text
        const copyParam = urlParams.get("copyParam");
        document.execCommand("copy");
        navigator.clipboard.writeText(copyParam!).then(function () {
          window.open("about:blank", "_self");
          window.close();
        });
      }
    }, 100);
  });

  return (
    <>
      <header className="h-screen overflow-auto bg-gradient-to-b from-gray-900 to-slate-800 text-white p-20 flex flex-col justify-center items-center">
        <div className="w-[90vw] lg:w-[50vw]">
          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-2">
            Copy to clipboard bookmark
          </h1>
          <p className="text-center mb-6 text-lg">
            Create a handy bookmark to copy text to your clipboard!
          </p>

          <div class="flex flex-col justify-center items-left">
            <br />
            <h2 className="text-2xl text-slate-400">Step 1</h2>
            <p className="mb-2">
              ↖ Accept the prompt to allow clipboard access (select forever)
            </p>

            <br />
            <h2 className="text-2xl text-slate-400">Step 2</h2>
            <p className="mb-2">Enter text to copy</p>
            <input
              type="text"
              placeholder="Try something you often copy & paste"
              value={value!}
              onInput={(e) => setValue((e.target as HTMLInputElement).value)}
              className="bg-slate-700/50 p-3 rounded-xl"
            />

            <br />
            <h2 className="text-2xl text-slate-400">Step 3</h2>
            <p className="mb-2">Enter bookmark name</p>
            <input
              type="text"
              value={bookmarkName!}
              onInput={(e) =>
                setBookmarkName(
                  capitalize((e.target as HTMLInputElement).value)
                )
              }
              className="bg-slate-700/50 p-3 rounded-xl"
            />

            <br />
            <h2 className="text-2xl text-slate-400">Step 4</h2>
            <p className="mb-2">Drag the below link to your bookmarks bar</p>
            <a
              id="generate-link"
              className="min-h-12 text-2xl bg-slate-700/50 w-48 text-center py-2 px-4 rounded-xl text-cyan-500 hover:bg-slate-700 hover:underline"
              href={`javascript: (() => {const url = '${SITE_URL}/?copyParam=${value}';myWindow=window.open(url, '_blank', 'width=200, height=200');myWindow.document.close();})();`}
            >
              {bookmarkName}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
