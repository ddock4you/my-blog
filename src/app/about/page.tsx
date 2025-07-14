import { Mail, Github, Twitter, Code, Coffee, Book } from "lucide-react";

export const metadata = {
  title: "소개 | My Blog",
  description: "블로그 작성자와 블로그에 대한 소개 페이지입니다.",
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          안녕하세요! 👋
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">개발자이자 블로거입니다.</p>
      </div>

      {/* 소개 섹션 */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">저에 대해서</h2>

          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              안녕하세요! 저는 웹 개발과 새로운 기술에 관심이 많은 개발자입니다. 이 블로그를 통해
              제가 배운 것들과 경험을 공유하고 있습니다.
            </p>

            <p>
              주로 JavaScript, TypeScript, React, Next.js 등의 프론트엔드 기술과 Node.js를 활용한
              백엔드 개발에 관심을 가지고 있습니다.
            </p>

            <p>
              개발뿐만 아니라 새로운 것을 배우고 성장하는 과정을 즐기며, 지식을 나누는 것을
              좋아합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">주요 기술 스택</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "JavaScript",
            "TypeScript",
            "React",
            "Next.js",
            "Node.js",
            "Tailwind CSS",
            "Git",
            "VS Code",
            "Vercel",
          ].map((tech) => (
            <div
              key={tech}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <Code className="h-4 w-4 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 관심사 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">관심사</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Code className="h-8 w-8 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">개발</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              새로운 기술과 트렌드를 학습하고 실제 프로젝트에 적용해보는 것을 좋아합니다.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Book className="h-8 w-8 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">학습</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              꾸준한 학습과 성장을 통해 더 나은 개발자가 되고자 노력하고 있습니다.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Coffee className="h-8 w-8 text-amber-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">공유</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              배운 것들을 블로그와 커뮤니티를 통해 다른 사람들과 공유하는 것을 즐깁니다.
            </p>
          </div>
        </div>
      </div>

      {/* 연락처 */}
      <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">연락하기</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          궁금한 점이 있거나 함께 이야기하고 싶은 주제가 있다면 언제든 연락해주세요!
        </p>

        <div className="flex justify-center space-x-6">
          <a
            href="mailto:contact@example.com"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>이메일</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
}
