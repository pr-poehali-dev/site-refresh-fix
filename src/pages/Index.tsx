import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Translation {
  id: string;
  game: string;
  modName: string;
  author: string;
  version: string;
  downloadUrl: string;
}

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    game: 'TES V SKYRIM',
    modName: '',
    author: '',
    version: '',
    downloadUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/1b46ded0-1ccb-41d3-bdbc-6e1171dcc279');
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Ошибка загрузки русификаторов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/04739d63-7227-4d85-bb91-a6d7d6aaf754', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password
        }
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setIsAuthenticated(true);
        toast({
          title: 'Вход выполнен',
          description: 'Добро пожаловать в админ-панель'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверный пароль',
          variant: 'destructive'
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к серверу',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/aeb35838-73ab-4d18-b436-41ba29ea3bb7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Русификатор добавлен в базу данных'
        });
        setFormData({
          game: 'TES V SKYRIM',
          modName: '',
          author: '',
          version: '',
          downloadUrl: ''
        });
        loadTranslations();
      } else {
        throw new Error('Ошибка при добавлении');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить русификатор',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/a7f24e45-c0e3-4d24-ab93-d31c3b813464', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Русификатор удалён'
        });
        loadTranslations();
      } else {
        throw new Error('Ошибка при удалении');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить русификатор',
        variant: 'destructive'
      });
    }
  };

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
            <button 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="text-gray-500 hover:text-gray-300 transition"
            >
              <Icon name="Settings" size={20} />
            </button>
          </nav>
        </div>
      </header>

      {showAdminPanel && !isAuthenticated && (
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="container mx-auto px-4 py-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Вход в админ-панель</h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="password">Пароль администратора</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Войти
              </Button>
            </form>
          </div>
        </div>
      )}

      {showAdminPanel && isAuthenticated && (
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Добавить русификатор</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="game">Игра</Label>
                    <select
                      id="game"
                      value={formData.game}
                      onChange={(e) => setFormData({...formData, game: e.target.value})}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                    >
                      <option value="TES V SKYRIM">TES V SKYRIM</option>
                      <option value="The Witcher Wild Hunt">The Witcher Wild Hunt</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="modName">Название мода</Label>
                    <Input
                      id="modName"
                      value={formData.modName}
                      onChange={(e) => setFormData({...formData, modName: e.target.value})}
                      placeholder="Например: Legacy of the Dragonborn"
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Автор перевода</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="Ваш ник"
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="version">Версия</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) => setFormData({...formData, version: e.target.value})}
                      placeholder="1.0"
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="downloadUrl">Ссылка на скачивание</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                    placeholder="https://..."
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? 'Добавление...' : 'Добавить русификатор'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

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
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Загрузка русификаторов...</p>
            </div>
          ) : filteredTranslations.length === 0 ? (
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
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => window.open(translation.downloadUrl, '_blank')}
                        className="bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all"
                      >
                        <Icon name="Download" size={18} className="mr-2" />
                        Скачать
                      </Button>
                      {isAuthenticated && (
                        <Button 
                          onClick={() => handleDelete(translation.id)}
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      )}
                    </div>
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
                <Icon name="Sword" size={32} className="text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Witcher Wild Hunt</h3>
                  <ol className="space-y-2 text-gray-400">
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">1.</span>
                      <span>Скачайте архив с модификацией</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-600 font-bold">2.</span>
                      <span>Поместите в папку Mods директории игры</span>
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

      <footer className="border-t border-zinc-800 mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-gray-500">
          <p>© 2024 ruprojectgames. Все русификаторы предоставляются бесплатно</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
