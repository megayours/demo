"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '../components/ContextProvider';
import { tokenChainApi } from '../api/blockchain/tokenChainApi';
import { Session } from '@chromia/ft4';
import { BLOCKCHAINS } from '../lib/constants';
import Spinner from '../components/Spinner';
import getTokenYoursChromiaClient from '../lib/tokenChainChromiaClient';
import { TokenMetadata, Property } from '../types/nft';

function CreateNFT() {
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [project, setProject] = useState('');
  const [collection, setCollection] = useState('');
  const [properties, setProperties] = useState<{[key: string]: string | number | boolean | Property}>({});
  const [newPropertyKey, setNewPropertyKey] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenChainSession, setTokenChainSession] = useState<Session | undefined>();
  const { sessions } = useSessionContext();
  const router = useRouter();

  const [projects, setProjects] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const tokenClient = await getTokenYoursChromiaClient();
      const tokenSession = sessions[tokenClient.config.blockchainRid.toUpperCase()];
      setTokenChainSession(tokenSession);
      if (tokenSession) {
        const fetchedProjects = await tokenChainApi.getProjects(tokenSession);
        setProjects(fetchedProjects);
      }
    };

    fetchSession();
  }, [sessions]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (tokenChainSession && project) {
        const fetchedCollections = await tokenChainApi.getCollections(tokenChainSession, project);
        setCollections(fetchedCollections);
      } else {
        setCollections([]);
      }
    };

    fetchCollections();
  }, [tokenChainSession, project]);

  const handleAddProperty = () => {
    if (newPropertyKey && newPropertyValue) {
      setProperties(prev => ({
        ...prev,
        [newPropertyKey]: newPropertyValue
      }));
      setNewPropertyKey('');
      setNewPropertyValue('');
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = e.target.value;
    if (selectedProject === 'new') {
      setIsNewProject(true);
      setProject('');
    } else {
      setIsNewProject(false);
      setProject(selectedProject);
      setCollection('');
      setIsNewCollection(false);
    }
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCollection = e.target.value;
    if (selectedCollection === 'new') {
      setIsNewCollection(true);
      setCollection('');
    } else {
      setIsNewCollection(false);
      setCollection(selectedCollection);
    }
  };

  const handleNewProjectSubmit = () => {
    if (newProjectName && !projects.includes(newProjectName)) {
      setProjects(prev => [...prev, newProjectName]);
      setProject(newProjectName);
      setNewProjectName('');
      setIsNewProject(false);
    }
  };

  const handleNewCollectionSubmit = () => {
    if (newCollectionName && !collections.includes(newCollectionName)) {
      setCollections(prev => [...prev, newCollectionName]);
      setCollection(newCollectionName);
      setNewCollectionName('');
      setIsNewCollection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenChainSession) return;

    setIsLoading(true);
    try {
      const metadata: TokenMetadata = {
        name: tokenName,
        properties: properties,
        yours: {
          modules: [],
          project: {name: project, owner_id: tokenChainSession.account.id },
          collection: collection,
        },
        description: tokenDescription,
        image: imageUrl,
      };
      await tokenChainApi.createNFT(tokenChainSession, metadata);
      router.push('/inventory');
    } catch (error) {
      console.error("Error creating NFT:", error);
      // Here you might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenChainSession) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <p>Please connect to {BLOCKCHAINS.TOKEN_CHAIN} to create an NFT.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="tokenName" className="block text-sm font-medium mb-1">Token Name</label>
          <input
            type="text"
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface)] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tokenDescription" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="tokenDescription"
            value={tokenDescription}
            onChange={(e) => setTokenDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface)] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface)] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="project" className="block text-sm font-medium mb-1">Project</label>
          <div className="flex">
            <select
              id="project"
              value={isNewProject ? 'new' : project}
              onChange={handleProjectChange}
              className="flex-grow px-3 py-2 bg-[var(--color-surface)] border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            >
              <option value="">Select a project</option>
              <option value="new">Create new project</option>
              {projects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {isNewProject && (
              <div className="flex flex-grow">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New project name"
                  className="flex-grow px-3 py-2 bg-[var(--color-surface)] border-t border-b border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleNewProjectSubmit}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-r-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="collection" className="block text-sm font-medium mb-1">Collection</label>
          <div className="flex">
            <select
              id="collection"
              value={isNewCollection ? 'new' : collection}
              onChange={handleCollectionChange}
              className="flex-grow px-3 py-2 bg-[var(--color-surface)] border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
              disabled={!project}
            >
              <option value="">Select a collection</option>
              <option value="new">Create new collection</option>
              {collections.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {isNewCollection && (
              <div className="flex flex-grow">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="New collection name"
                  className="flex-grow px-3 py-2 bg-[var(--color-surface)] border-t border-b border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleNewCollectionSubmit}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-r-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Properties</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newPropertyKey}
              onChange={(e) => setNewPropertyKey(e.target.value)}
              placeholder="Key"
              className="flex-1 px-3 py-2 bg-[var(--color-surface)] border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <input
              type="text"
              value={newPropertyValue}
              onChange={(e) => setNewPropertyValue(e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 bg-[var(--color-surface)] border-t border-b border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <button
              type="button"
              onClick={handleAddProperty}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-r-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              Add
            </button>
          </div>
          {Object.entries(properties).length > 0 && <div className="mt-2 bg-[var(--color-surface)] border border-gray-600 rounded-md p-2">
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium">{key}:</span> {value.toString()}
              </div>
            ))}
          </div>}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="small" /> : 'Create NFT'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNFT;