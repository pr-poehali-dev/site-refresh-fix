import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      setIsAuthenticated(true);
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в админ-панель'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/02f72b96-303b-4e9d-b7fa-b82a186f2abb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Русификатор добавлен на сайт'
        });
        setFormData({
          game: 'TES V SKYRIM',
          modName: '',
          author: '',
          version: '',
          downloadUrl: ''
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось добавить русификатор',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к серверу',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
            <p className="text-gray-400">Введите пароль для доступа</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Пароль администратора"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all"
            >
              Войти
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">Админ-панель</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="border-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-900"
          >
            <Icon name="Home" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Добавить русификатор</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="game" className="text-white mb-2 block">Игра</Label>
              <select
                id="game"
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-4 py-2"
                required
              >
                <option value="TES V SKYRIM">TES V SKYRIM</option>
                <option value="The Witcher Wild Hunt">The Witcher Wild Hunt</option>
              </select>
            </div>

            <div>
              <Label htmlFor="modName" className="text-white mb-2 block">Название мода</Label>
              <Input
                id="modName"
                type="text"
                placeholder="Например: Falskaar"
                value={formData.modName}
                onChange={(e) => setFormData({ ...formData, modName: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-white mb-2 block">Автор перевода</Label>
              <Input
                id="author"
                type="text"
                placeholder="Ваш ник или имя команды"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="version" className="text-white mb-2 block">Версия</Label>
              <Input
                id="version"
                type="text"
                placeholder="1.0 или 2.5.3"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="downloadUrl" className="text-white mb-2 block">Ссылка на скачивание</Label>
              <Input
                id="downloadUrl"
                type="url"
                placeholder="https://..."
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all"
            >
              {isSubmitting ? 'Добавление...' : 'Добавить русификатор'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Admin;
