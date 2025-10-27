import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Translation {
  id: string;
  game: string;
  modName: string;
  author: string;
  version: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [translations] = useState<Translation[]>([]);

  const filteredTranslations = translations.filter((t) => {
    const matchesSearch = t.modName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'Все' || t.game === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
              <Icon name="Swords" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">ruprojectgames</span>
          </div>
          
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition">Главная</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Русификаторы</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Инструкции</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Новости</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Русификация модов для RPG</h1>
          <p className="text-xl text-gray-400">База переводов для модов TES V SKYRIM и The Witcher Wild Hunt</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all">
            <Icon name="Download" size={18} className="mr-2" />
            Скачать русификатор
          </Button>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all">
            <Icon name="BookOpen" size={18} className="mr-2" />
            Инструкции
          </Button>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Поиск по названию или автору..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border-zinc-800 text-white pl-12 py-6 text-lg"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={activeTab === 'Все' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Все')}
            className={activeTab === 'Все' ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all' : 'border-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-900 hover:shadow-[0_0_10px_rgba(220,38,38,0.2)] transition-all'}
          >
            Все
          </Button>
          <Button
            variant={activeTab === 'TES V SKYRIM' ? 'default' : 'outline'}
            onClick={() => setActiveTab('TES V SKYRIM')}
            className={activeTab === 'TES V SKYRIM' ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all' : 'border-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-900 hover:shadow-[0_0_10px_rgba(220,38,38,0.2)] transition-all'}
          >
            TES V SKYRIM
          </Button>
          <Button
            variant={activeTab === 'The Witcher Wild Hunt' ? 'default' : 'outline'}
            onClick={() => setActiveTab('The Witcher Wild Hunt')}
            className={activeTab === 'The Witcher Wild Hunt' ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all' : 'border-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-900 hover:shadow-[0_0_10px_rgba(220,38,38,0.2)] transition-all'}
          >
            The Witcher Wild Hunt
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {filteredTranslations.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="FolderOpen" size={64} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-300">Русификаторы скоро появятся</h3>
              <p className="text-gray-500">Здесь будут отображаться все доступные переводы модов</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTranslations.map((translation) => (
                <div key={translation.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-red-600 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{translation.modName}</h3>
                      <p className="text-gray-400 mb-2">{translation.game}</p>
                      <p className="text-sm text-gray-500">Автор: {translation.author} • Версия: {translation.version}</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all">
                      <Icon name="Download" size={18} className="mr-2" />
                      Скачать
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как установить русификатор?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Icon name="Swords" size={32} className="text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-3">TES V SKYRIM</h3>
                  <ol className="space-y-2 text-gray-400">
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">1.</span>
                      <span>Скачайте архив с русификатором</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">2.</span>
                      <span>Распакуйте содержимое в папку Data игры</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">3.</span>
                      <span>Активируйте ESP файл в лаунчере</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Icon name="Swords" size={32} className="text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Witcher Wild Hunt</h3>
                  <ol className="space-y-2 text-gray-400">
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">1.</span>
                      <span>Скачайте русификатор мода</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">2.</span>
                      <span>Скопируйте файлы в папку Mods</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">3.</span>
                      <span>Запустите игру через Script Merger</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;